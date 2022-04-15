const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'))

const on = (element, event, selector, handler) =>{
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

on(document, 'click', '.btnEditar', e =>{
    const fila = e.target.parentNode.parentNode
    txtCedula_editar.value = fila.children[0].innerHTML
    txtNombre_editar.value = fila.children[1].innerHTML
    txtCorreo_editar.value = fila.children[2].innerHTML
    txtUsuario_editar.value = fila.children[3].innerHTML
    txtPassword_editar.value = fila.children[4].innerHTML
    modalUsuario.show()
})

function confirmar(_id){
    Swal.fire({
    title: '¿Desea eliminar el Usuario '+_id+'?',
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
            title: 'Usuario borrado con exito',
            showConfirmButton: false,
            timer: 15000
        })
        window.location='usuarios/eliminar/'+_id
    }
  })
}

function verPassword()
{
    var tipo = document.getElementById("txtPassword");
    if(tipo.type == "password")
    {
        tipo.type = "text";
    }
    else
    {
        tipo.type = "password";
    }
}