# meli-mutants
Este es un backend's API para resolver los problemas con Meli-Mutants

Para ejecutar la API debera ingresar a la siguiente URL

Tipo de Metodo: POST
Url: http://IP:3000/api/mutants
Datos de HEADER:
  {"Content-Type":"application/json"}
Body:
{
  	"DNA":"AAACC,BBCTM,CCCTM,CAATM,MMMMC"
}

Tomar en cuenta que el servicio devolverá:

HTTP: 200 - ok -> para los casos en que el string sea un mutantRouter
HTTP: 403 - forbidden -> para los casos en que el dna sea invalido

HTTP: 500 - error -> en caso de que haya ocurrido algun error dentro de la ejecucion de la solicitud

Se considera DNA invalido cuando el string ingresado no sea del tipo NxN.

En caso de ser un DNA invalido, el mensaje a devolver es 403-forbidden.

Los DNA invalidos no seran insertados en la base de datos.

Para obtener las estadisticas debera ejecutar la siguiente peticion.

Tipo de Metodo: GET
Url: http://IP:3000/api/stats
Datos de HEADER:
  {"Content-Type":"application/json"}

Tomar en cuenta que el servicio devolverá:

HTTP: 200 - ok -> con el json correspondiente a los valores de la solicitud

HTTP: 500 - error -> en caso de que haya ocurrido algun error dentro de la ejecucion de la solicitud
