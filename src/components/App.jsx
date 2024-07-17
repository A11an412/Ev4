import { Fragment, useState, useRef, useEffect } from "react";
import GastoItem from "./GastoItem";
import Modal from 'react-modal';
import uuid4 from "uuid4";


const GastoList = () => {
    const [gastos, setGastos] = useState([
        { id: 1, nombre: "Compra en supermercado", cantidad: 50000, pagado: false, descripcion: "Alimentos y bebidas", categoria: "Supermercado", fecha: "2020-07-10" },
        { id: 2, nombre: "Suscripción al gimnasio", cantidad: 20000, pagado: true, descripcion: "Mensualidad", categoria: "Fitness", fecha: "2021-07-01" },
        { id: 3, nombre: "Libros para estudio", cantidad: 3000, pagado: true, descripcion: "Libros académicos", categoria: "Educación", fecha: "2022-06-25" },
        { id: 4, nombre: "Cena en restaurante", cantidad: 46000, pagado: false, descripcion: "Cena con amigos", categoria: "Restaurantes", fecha: "2023-07-14" },
        { id: 5, nombre: "Compra de ropa", cantidad: 10000, pagado: true, descripcion: "Ropa nueva", categoria: "Moda", fecha: "2024-07-05" }
    ]);

    useEffect(() => {
        const gastosGuardados = JSON.parse(localStorage.getItem('gastos'));
        if (gastosGuardados) {
            setGastos(gastosGuardados);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('gastos', JSON.stringify(gastos));
    }, [gastos]);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [gastoToDelete, setGastoToDelete] = useState(null);
    const [errors, setErrors] = useState({});

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    Modal.setAppElement('#root');

    const openModal = (gasto) => {
        setGastoToDelete(gasto);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const confirmDelete = () => {
        const gastosRestantes = gastos.filter((gasto) => gasto.id !== gastoToDelete.id);
        setGastos(gastosRestantes);
        closeModal();
    };

    const agregarGasto = () => {
        const nombre = nombreRef.current.value.trim();
        const cantidad = parseFloat(cantidadRef.current.value.trim());
        const descripcion = descripcionRef.current.value.trim();
        const categoria = categoriaRef.current.value.trim();
        const fecha = fechaRef.current.value;

        // Validaciones
        if (nombre === "" || isNaN(cantidad) || cantidad <= 0 || descripcion === "" || categoria === "" || fecha === "") {
            let validationErrors = {};
            if (nombre === "") validationErrors.nombre = "El nombre es obligatorio";
            if (isNaN(cantidad) || cantidad <= 0) validationErrors.cantidad = "La cantidad debe ser un número positivo";
            if (descripcion === "") validationErrors.descripcion = "La descripción es obligatoria";
            if (categoria === "") validationErrors.categoria = "La categoría es obligatoria";
            if (fecha === "") validationErrors.fecha = "La fecha es obligatoria";
            setErrors(validationErrors);
            return;
        }

        setGastos((prevGastos) => {
            const nuevoGasto = {
                id: uuid4(),
                nombre: nombre,
                cantidad: cantidad,
                pagado: false,
                descripcion: descripcion,
                categoria: categoria,
                fecha: fecha
            };
            return [...prevGastos, nuevoGasto];
        });

        setErrors({});
        nombreRef.current.value = "";
        cantidadRef.current.value = "";
        descripcionRef.current.value = "";
        categoriaRef.current.value = "";
        fechaRef.current.value = "";
    };

    const cambiarEstado = (id) => {
        const nuevosGastos = gastos.map((gasto) =>
            gasto.id === id ? { ...gasto, pagado: !gasto.pagado } : gasto
        );
        setGastos(nuevosGastos);
    };

    const nombreRef = useRef();
    const cantidadRef = useRef();
    const descripcionRef = useRef();
    const categoriaRef = useRef();
    const fechaRef = useRef();

    return (
        <Fragment>
            <div className="container mt-5">
                <h1 className="mt-3">Seguimiento de Gastos</h1>
                <br />
                <br />
                <h2 className="text-center">Agregar Gasto </h2>
                <div className="row mt-3">
                    <div className="col-md-6 offset-md-3">
                        <div className="mb-3">
                            <label className="form-label">Nombre del Gasto</label>
                            <input type="text" className="form-control" ref={nombreRef} />
                            {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Cantidad</label>
                            <input type="number" className="form-control" ref={cantidadRef} />
                            {errors.cantidad && <div className="text-danger">{errors.cantidad}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input type="text" className="form-control" ref={descripcionRef} />
                            {errors.descripcion && <div className="text-danger">{errors.descripcion}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Categoría</label>
                            <input type="text" className="form-control" ref={categoriaRef} />
                            {errors.categoria && <div className="text-danger">{errors.categoria}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input type="date" className="form-control" ref={fechaRef} />
                            {errors.fecha && <div className="text-danger">{errors.fecha}</div>}
                        </div>
                        <button className="btn btn-primary" onClick={agregarGasto}>Agregar Gasto</button>
                    </div>
                </div>
                
                <div className="row my-4"></div>
                <div className="div">
                    <h3>Gastos Realizados</h3>
                </div>


                <div className="row mt-5">
                    {gastos.map((gasto) => (
                        <div className="col-md-4" key={gasto.id}>
                            <GastoItem gasto={gasto} cambiarEstado={cambiarEstado} openModal={openModal} />
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Confirmar Eliminación"
            >
                <h2>¿Estás seguro de que quieres eliminar este gasto?</h2>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={closeModal}>Cancelar</button>
                    <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
                </div>
            </Modal>
        </Fragment>
    );
};

export default GastoList;