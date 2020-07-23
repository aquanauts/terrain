
# Terrain

Remote web application monitoring

# Getting Started

Terrain is packaged as a docker image. Run it like so:

```bash
sudo mkdir -p /usr/share/terrain/data
docker run --rm -it -p 8080:8080 -v /usr/share/terrain/data:/root/data aquatic.com/terrain
```

Now, open your browser and go to [http://localhost:8080/example](http://localhost:8080/example). This is an example application that include the Terrain client library. Generate some data for yourself by triggering some error on this page. Then, you can visit the [Terrain UI](http://localhost:8080) to see these errors.


In this example, error and session information will be stored on your local machine in `/usr/share/terrain/data`.

## Developer Usage

   * Write tests with [pytest](https://docs.pytest.org/en/latest/getting-started.html)
   * Run tests with [pytest-watch](https://github.com/joeyespo/pytest-watch)
   * Manage dependencies with [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
   * Run `make` for help on other tasks


