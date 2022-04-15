const modalProveedor = new bootstrap.Modal(document.getElementById('modalProveedor'))

const on = (element, event, selector, handler) =>{
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

on(document, 'click', '.btnEditar', e =>{
    const fila = e.target.parentNode.parentNode
    txtNIT_editar.value = fila.children[0].innerHTML
    txtNombre_editar.value = fila.children[1].innerHTML
    txtCiudad_editar.value = fila.children[2].innerHTML
    txtDireccion_editar.value = fila.children[3].innerHTML
    txtTelefono_editar.value = fila.children[4].innerHTML
    modalProveedor.show()
})

function confirmar(_id){
    Swal.fire({
    title: '¿Desea eliminar el proveedor '+_id+'?',
    text: "Esta accion no se puede revertir.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar'
    }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'proveedor borrado con exito',
            showConfirmButton: false,
            timer: 15000
        })
        window.location='proveedores/eliminar/'+_id
    }
  })
}
