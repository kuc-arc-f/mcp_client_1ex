
import React from "react";
import {Link } from 'react-router-dom';
//
function Page() {
    return (
    <div>
        <Link to="/">Home</Link>
        <Link to="/about">&nbsp; [ about ]</Link>
        <hr />
    </div>
    );
}
export default Page;
