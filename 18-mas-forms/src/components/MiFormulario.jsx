import React from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    nombre: Yup.string()
    .min(3, "El nombre es muy corto")
    .max(40, "El nombre es muy ñargo")
    .required("Campo obligatorio"),

    email: Yup.string().email("Email inválido")
    .required("Campo obligatorio")
});

export const MiFormulario = () => {

    const formik = useFormik({
        initialValues: {
            nombre: "",
            email: "",
        },
        validationSchema,
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
                    <div className='error'>
                        {formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : ""}
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input type='text' id='email' name='email' 
                    value={formik.values.email}
                    onChange={formik.handleChange}/>
                    <div className='error'>
                        {formik.errors.email && formik.touched.email ? formik.errors.email : ""}
                    </div>
                </div>

                <input type='submit' value="Enviar" />
            </form>
        </div>
    )
}
