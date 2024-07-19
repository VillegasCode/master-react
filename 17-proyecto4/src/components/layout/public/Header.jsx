import React from 'react'
import { Nav } from './Nav'
import { NavLink } from 'react-router-dom'

export const Header = () => {
    return (
        <header className="layout__navbar">

            <div className="navbar__header">
                <NavLink to="/login" className="navbar__title">hit10Xharder</NavLink>
            </div>
            <Nav />
        </header>
    )
}
