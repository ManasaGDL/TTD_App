
import PropTypes from 'prop-types'
import Navbar from '../Common/Navbar'
const Layouts = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <div className="container mx-auto  flex-1">
       {children}
    </div>
    </div>
  )
}

export default Layouts
Layouts.propTypes ={
    children:PropTypes.node.isRequired
}