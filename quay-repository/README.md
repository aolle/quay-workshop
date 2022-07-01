# Quay Repositories

## Creating an image repository

1. Click `Create New Repository`.

![Quay Create Repository](img/create-repo.png)

2. Select the organization in the drop down list, name the repository `kafka` and set `Public` visibility.

![Quay Create Repository Config](img/repo-config.png)

3. Click `Create Public Repository`.

## Push (and Tag) an image into the repository

1. Pull an image from the public registry.

```sh
podman pull quay.io/strimzi/kafka:latest-kafka-3.1.0
```

2. Tag the image.

```sh
podman tag quay.io/strimzi/kafka:latest-kafka-3.1.0 <QUAY_HOSTNAME>/userorg/kafka:3.1.0
```

3. Sign into our Quay.

```sh
podman login <QUAY_HOSTNAME>
```

4. Push the image to Quay repository.

```sh
podman push <QUAY_HOSTNAME>/userorg/kafka:3.1.0
```

5. Check that the image has been pushed into our Quay repository.

![Image pushed into our Quay](img/image-pushed.png)

## Inspecting image layers

1. Navigate to the `userorg/kafka` repository.

2. Click the `Tags`icon.

3. We should have the 3.1.0 tag. Under `MANIFEST`, click on the `SHA256` value `20cffe996455`. We will see the layers dashboard.

![Image Layers](img/img-layers.png)

## Pull an image from the repository

1. From Quay dashboard, click on `userorg/kafka` repository.

2. Click `Tags`.

3. On any of the tags, click the `Fetch Tag` icon.

4. Select `Docker Pull (by tag)` from the `Image Format` drop down and click the `Copy Command` button.

![Fetch Tag](img/fetchtag.png)

5. Switch to a terminal, paste and execute the command on it. Docker or podman is required. If we're using podman, we have to replace the `docker` with `podman` before execute the command.

## OCI-based Artifacts Repository - Helm Charts Repository Example

Quay can be used to store OCI-based artifacts like Helm charts. As an example, we are going to create a Helm charts repository on it.

1. Login to Quay registry with helm.

```sh
helm registry login <QUAY_HOSTNAME>
```

2. Pull a chart.

```sh
helm pull https://redhat-developer.github.io/redhat-helm-charts/charts/quarkus-0.0.3.tgz
```

3. Push the chart into Quay repository.

```sh
helm push quarkus-0.0.3.tgz oci://<QUAY_HOSTNAME>/userorg/helm
```

4. Open the Quay Dashboard and open the `userorg/helm/quarkus` and go to `Tags`.

![Quay Helm Repository](img/helmrepo.png)

The Helm chart is published to Quay as an OCI image.

5. The Helm chart can be installed directly from the repository.

```sh
helm install quarkus oci://<QUAY_HOSTNAME>/userorg/helm/quarkus --version=0.0.3
```
