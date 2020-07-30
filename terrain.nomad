job "terrain" {
    datacenters = ["cy2"]
    type = "service"
    group "server" {
        count = 1
        task "terrain-server" {
            driver = "docker"
            config {
                image = "artifactory.aq.tc/interns/terrain-server:latest"
                port_map {
                    http = 8080
                }
                volumes = ["terrain:/root/terrain/data"]
                volume_driver = "pure"
                logging {
                    type = "journald"
                    config {
                        env = "NOMAD_JOB_NAME"
                    }
                }
            }
            env {
                BUILDBOT_URL = "https://buildbot.aq.tc"
                RELEASE_VERSION = "${version}"
            }

            resources {
                network {
                    port "http" {}
                }
                cpu = 1600
                memory = 500 # MB
            }
            service {
                name = "terrain"
                tags = ["urlprefix-terrain.aq.tc/"]
                port = "http"
                check {
                    name = "alive"
                    type = "http"
                    path = "/"
                    interval = "10s"
                    timeout= "2s"
                }
            }
        }
    }
}
