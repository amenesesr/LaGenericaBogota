$(document).ready(function() {
  $('#tablaClientes').DataTable({
      "language": {
        "decimal": ",",
        "thousands": ".",
        "lengthMenu": "Muestra _MENU_ registros por pagina",
        "zeroRecords": "No hay registros en la tabla",
        "info": "Mostrando Pagina _PAGE_ de _PAGES_",
        "infoEmpty": "No hay registros en la tabla",
        "infoFiltered": "(Filtrado de _MAX_ registros totales)",
        "search": "Buscar: ",
        "paginate": {
        "next": "Siguiente Pagina",
        "previous": "Pagina Anterior"
      }
    }
  });
});

$(document).ready(function() {
  $('#tablaVentas').DataTable({
      "language": {
      "decimal": ",",
      "thousands": ".",
      "lengthMenu": "Muestra _MENU_ registros por pagina",
      "zeroRecords": "No hay registros en la tabla",
      "info": "Mostrando Pagina _PAGE_ de _PAGES_",
      "infoEmpty": "No hay registros en la tabla",
      "infoFiltered": "(Filtrado de _MAX_ registros totales)",
      "search": "Buscar: ",
      "paginate": {
      "next": "Siguiente Pagina",
      "previous": "Pagina Anterior"
     }
    }
  });
});

function muestra_ocultaclientes(id){
  if (document.getElementById){ //se obtiene el id
    var el = document.getElementById(id); //se define la variable "el" igual a nuestro div
    el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
  }
}

function muestra_ocultaventas(id){
  if (document.getElementById){ //se obtiene el id
    var el = document.getElementById(id); //se define la variable "el" igual a nuestro div
    el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
  }

}

window.onload = function(){/*hace que se cargue la función lo que predetermina que div estará oculto hasta llamar a la función nuevamente*/
  muestra_ocultaclientes('clientes');
  muestra_ocultaventas('ventas');/* "contenido_a_mostrar" es el nombre que le dimos al DIV */
}