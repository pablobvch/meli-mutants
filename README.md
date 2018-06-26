# Meli-mutants
Este es un backend's API para resolver los problemas con Meli-Mutants

## Install and Setup

```bash
$ npm install && npm start
```

## Api Reference

Para ejecutar la API debera ingresar a la siguiente URL

### Validate Mutant

```http
POST /api/mutants HTTP/1.1
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Content-type: application/json
Host: https://meli-mutant.herokuapp.com
Body: { "DNA":"AAACC,BBCTM,CCCTM,CAATM,MMMMC" }
```

Tomar en cuenta que el servicio devolverá:

```
HTTP: 200 - ok -> para los casos en que el string sea un mutantRouter
HTTP: 403 - forbidden -> para los casos en que el dna sea invalido
HTTP: 500 - error -> en caso de que haya ocurrido algun error dentro de la ejecucion de la solicitud
```
Se considera DNA invalido cuando el string ingresado no sea del tipo NxN.

En caso de ser un DNA invalido, el mensaje a devolver es 403-forbidden.

Los DNA invalidos no seran insertados en la base de datos.

### Get Statistics

Para obtener las estadisticas debera ejecutar la siguiente peticion.

```http
GET /api/stats HTTP/1.1
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Content-type: application/json
Host: https://meli-mutant.herokuapp.com
```
Tomar en cuenta que el servicio devolverá:

```
HTTP: 200 - ok -> con el json correspondiente a los valores de la solicitud
HTTP: 500 - error -> en caso de que haya ocurrido algun error dentro de la ejecucion de la solicitud
```