SHELL := $(shell which bash)
MINICONDA := $(CURDIR)/.miniconda3
CONDA := $(MINICONDA)/bin/conda
CONDA_VERSION := 4.7.10
VENV := $(PWD)/.venv
DEPS := $(VENV)/.deps
PYTHON := $(VENV)/bin/python
PYTHON_CMD := PYTHONPATH=$(CURDIR) $(PYTHON)
PROJECT_NAME=$(shell basename $(CURDIR))
PYLINT_CMD := $(PYTHON_CMD) -m pylint $(PROJECT_NAME) test
DOCKER := $(shell which docker || echo ".docker_is_missing")
DOCKER_IMAGE := artifactory.aq.tc/interns/terrain-server
VERSION := $(shell git rev-list --count master)$(subst -master,,-$(shell git rev-parse --abbrev-ref HEAD))
export NOMAD_ADDR := https://nomad.aq.tc/

ifndef VERBOSE
.SILENT:
endif

.PHONY: help
help:
	grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

$(PROJECT_NAME):
	# Initialize the project
	git mv pythonista $(PROJECT_NAME)
	sed -i "s/pythonista/skyblock/g" test/main_test.py
	git add test/main_test.py

$(CONDA): | $(PROJECT_NAME)
	echo "Installing Miniconda3 to $(MINICONDA)"
	wget https://repo.anaconda.com/miniconda/Miniconda3-$(CONDA_VERSION)-Linux-x86_64.sh -O $(CURDIR)/miniconda.sh
	bash $(CURDIR)/miniconda.sh -u -b -p "$(CURDIR)/.miniconda3"
	rm $(CURDIR)/miniconda.sh

environment.yml: | $(CONDA)

$(DEPS): environment.yml
	$(CONDA) env create -f environment.yml -p $(VENV)
	cp environment.yml $(DEPS)

.PHONY: clean
clean:
	rm -rf $(VENV)
	rm -rf $(MINICONDA)
	find . -name __pycache__ | grep -v .venv | grep -v .miniconda3 | xargs rm -rf

.PHONY: test
test: $(DEPS)  ## Run tests
	$(PYTHON_CMD) -m pytest -v
	$(PYLINT_CMD)

.PHONY: watch
watch: $(DEPS) ## Run tests and linters continuously
	$(PYTHON_CMD) -m pytest_watch --runner $(VENV)/bin/pytest --ignore .venv -n --onpass '$(PYLINT_CMD)'

.PHONY: repl
repl: ## Run an iPython REPL
	$(VENV)/bin/ipython

.PHONY: solve
solve: | $(CONDA) ## Re-solve locked project dependencies from deps.yml
	rm -rf $(VENV)
	$(CONDA) env update --prune --quiet -p $(VENV) -f deps.yml
	$(CONDA) env export -p $(VENV) | grep -v ^prefix: > environment.yml
	cp environment.yml $(DEPS)

.PHONY: run
run: $(DEPS) ## Run the main function
	./run

.PHONY: run-dev
run-dev: $(DEPS) ## Run in development mode
	$(VENV)/bin/adev runserver --static web --static-url / --livereload --aux-port 35729 $(PROJECT_NAME)

docker: $(DOCKER)
	$(DOCKER) build . -t $(DOCKER_IMAGE):latest

docker-run: docker ## Run in docker
	mkdir -p $(CURDIR)/data
	docker run --rm -it -p 8080:8080 -v $(CURDIR)/data:/root/terrain/data $(DOCKER_IMAGE):latest

logs: ## Show logs for running job
	nomad logs --job terrain

.PHONY: release
release: test docker  ## Build a new docker image and deploy to nomad
	docker tag $(DOCKER_IMAGE):latest $(DOCKER_IMAGE):$(VERSION)
	$(DOCKER) push $(DOCKER_IMAGE):$(VERSION)
	$(DOCKER) push $(DOCKER_IMAGE):latest
	echo "Releasing version $(VERSION)"
	nomad job status terrain &> /dev/null && nomad job stop terrain
	$(PYTHON) nomad_render.py --version "$(VERSION)" terrain.nomad | nomad job run -
