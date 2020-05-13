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
