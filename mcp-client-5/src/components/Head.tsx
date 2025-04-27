//import { Routes, Route, Link } from 'react-router-dom';
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
/*
<Link to="/test4">&nbsp; [ test4 ]</Link>
*/