import { Outlet } from 'react-router-dom'

function ArticlesLayout() {
  return (
    <div id="articles-layout-component" className='h-full bg-slate-50'>
      <Outlet />
    </div>
  )
}

export default ArticlesLayout
