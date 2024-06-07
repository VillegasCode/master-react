import React from 'react'
import { useFormik } from "formik";

export const MiFormulario = () => {

    const formik = useFormik({
        initialValues: {
            nombre: "",
            email: "",
        },
        onSubmit: values => {
            console.log(values);
        }
    });

    return (
        <div>
            <h1>MiFormulario</h1>

            <form onSubmit={formik.handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='nombre'>Nombre</label>
                    <input type='text' id='nombre' name='nombre' 
                    value={formik.values.nombre}
                    onChange={formik.handleChange}/>
                </div>

                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='text' id='email' name='email' 
                    value={formik.values.email}
                    onChange={formik.handleChange}/>
                </div>

                <input type='submit' value="Enviar" />
            </form>
        </div>
    )
}
