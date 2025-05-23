import { Link, Route, Routes } from 'react-router-dom'

const pages = import.meta.glob('./client/*.tsx', { eager: true })

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/client\/(.*)\.tsx$/)[1]
  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: pages[path].default,
  }
})

export function App() {
  return (
    <>
      <Routes>
        {routes.map(({ path, component: RouteComp }) => {
          return (
          <Route key={path} path={path} element={<RouteComp />} 
          ></Route>
          )
        })}
      </Routes>
    </>
  )
}
/*
<nav>
  <ul>
    {routes.map(({ name, path }) => {
      return (
        <li key={path}>
          <Link to={path}>{name}</Link>
        </li>
      )
    })}
  </ul>
</nav>
*/