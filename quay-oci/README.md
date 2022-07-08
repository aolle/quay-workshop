## OCI-based Artifacts Repository

Quay can be used to store OCI-based artifacts like Helm charts, encrypted container images, signed images, zstd compressed images, etc. 

## Configuring Allowed OCI Artifact Types

Some of the oci artifats that we are going to use on the next sections are not allowed by default. For example, the Helm charts and signed images are allowed by default, but the encrypted container images not (at least at the time of this writing). Follow this step if you want to upload encrypted images to Quay.

As a previous step, we are going to configure the ALLOWED_OCI_ARTIFACT_TYPES environment variable for allowing some of the oci artifacts that we will use soon.

1. Open a browser window and log in to the OpenShift Container Platform web console.

2. Click Operators → Installed Operators.

3. Select `quay-workshop` as the project and click on `Quay Registry`. Click to our `registry`.

![Quay Registry](img/quay-registry.png)

4. Click on the `Config Bundle Secret` secret (`registry-config-bundle-*`).

![Config Bundle Secret](img/config-bundle-secret.png)

5. In the `Actions` drop down, select `Edit Secret`.

6. Add the following into the `Value` text field. And click `Save`.

```yaml
ALLOWED_OCI_ARTIFACT_TYPES:
  application/vnd.oci.image.config.v1+json:
  - application/vnd.dev.cosign.simplesigning.v1+json
  - application/vnd.oci.image.layer.v1.tar+gzip+encrypted
  application/vnd.cncf.helm.config.v1+json:
  - application/tar+gzip
```

![Secret Value](img/valuesecret.png)

The `registry-quay-config-editor-*` and `registry-quay-app-*` pods will be restarted automatically with the new configuration.

## Helm Charts

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

## Signed Container Images

Image signing ensures the integrity of our image deployments. Quay will store the signature as an OCI artifact.

1. Download cosign and set execution permissions.

```sh
curl https://github.com/sigstore/cosign/releases/download/v1.9.0/cosign-linux-amd64 -L -o cosign
chmod +x cosign
```

2. Generate the key pair.

```sh
./cosign generate-key-pair

```

3. Sign an image and pull it to Quay.

```sh
# Pull the image
podman pull registry.redhat.io/rhel8/httpd-24:1-30

# Tag and push the image
podman tag registry.redhat.io/rhel8/httpd-24:1-30 <QUAY_HOSTNAME>/userorg/httpd-24:1-30
podman push <QUAY_HOSTNAME>/userorg/httpd-24:1-30

# Login
# If we already signed in with podman or docker, the password parameter is not required, as it will use config.json file
./cosign login <QUAY_HOSTNAME> -u <USER> -p <PASSWORD>

# Sign and push the signature
./cosign sign --key cosign.key <QUAY_HOSTNAME>/userorg/httpd-24:1-30
```

4. Navigate to the Quay Registry Dashboard, `userorg/httpd-24` repository.

5. Click `Tags`.

We will see our signature stored in it.

![Signature Stored in Quay Repository](img/signature.png)


## Encrypted Container Images

An image can be encrypted with a key or multiple keys. Also, we can encrypt the full image layers or some specific layer instead; also, we can encrypt all image layers or only some layer. In any case, we can store the container image into Quay.

The encrypted images are used when we want to protect private and sensitive content from our images, for example, in case of our registry is compromised.

Usually the image decrypting key is stored in a secret into our OCP cluster master node.

### Encrypted Container Images with JSON Web Encryption (JWE) (RFC7516)

1. Generate the encryption RSA keys with openssl.

```sh
# private key
openssl genrsa --out /tmp/private-key.pem 2048

# public key
openssl rsa -in /tmp/private-key.pem -pubout -out /tmp/public-key.pem
```

2. Copy the image that we want to encrypt.

```sh
skopeo copy docker://quay.io/centos7/httpd-24-centos7:latest oci:/tmp/local-httpd24:latest
```

3. Encrypt the image.

```sh
skopeo copy --encryption-key jwe:/tmp/public-key.pem oci:/tmp/local-httpd24:latest oci:/tmp/local-httpd24-encrypted:latest
```

4. Push the image to Quay.

```sh
skopeo copy oci:/tmp/local-httpd24-encrypted:latest docker://<QUAY_HOSTNAME>/userorg/httpd-24:encrypted
```

5. Navigate to the Quay Registry Dashboard, `userorg/httpd-24` repository.

6. Click `Tags`.

We will see our encrypted image stored in it.

![Encrypted Image Stored in Quay Repository](img/encrypted-img-into-repo.png)


### Encrypted Container Images with PGP (RFC4880)

