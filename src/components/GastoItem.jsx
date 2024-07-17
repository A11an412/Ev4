import { Fragment } from "react";

const GastoItem = ({ gasto, cambiarEstado, openModal }) => {
    const { id, nombre, cantidad, descripcion, categoria, fecha } = gasto;
    const fnCambiarEstado = () => {
        cambiarEstado(id);
    };
    return (
        <Fragment>
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text">Cantidad: {cantidad}</p>
                    <p className="card-text">Descripción: {descripcion}</p>
                    <p className="card-text">Categoría: {categoria}</p>
                    <p className="card-text">Fecha: {fecha}</p>

                    <button className="btn btn-danger" onClick={() => openModal(gasto)}>
                        Eliminar Gasto
                    </button>
                        

                </div>
            </div>
        </Fragment>
    );
}

export default GastoItem;