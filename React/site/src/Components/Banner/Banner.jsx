import React from 'react'
import { Link } from "react-router-dom";
import './Banner.css'

const Banner = () => {
    return (
        <div className="container-banner">
            <div className="content">
                <h1 className='title'>lorem ipsulum</h1>
                <h3 className='sub-title'>opsum dolor</h3>
                <Link to=''>
                    <input type="button" value="Compra Já" className='btn-default'/>
                </Link>
            </div>
        </div>
    )
}

export default Banner