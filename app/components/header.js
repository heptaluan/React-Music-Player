import React, { Component } from 'react';
import './header.scss';
import { Link } from 'react-router-dom';


class Header extends Component {
    render() {
        return(
            <Link to="/">
                <div className="components-header row">
                    <img className="-col-auto" src="/static/images/logo.png" width="40" alt=""/>
                    <h1 className="caption">React Music Player</h1>
                </div>
            </Link>
        )
    }
}

export default Header;
