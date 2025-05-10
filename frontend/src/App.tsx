import './App.css'
import Input from './components/Input';
import { ListView } from './components/ListView'
import Shorturl from './components/Shorturl';
import { UrlProvider } from './context/urlContext';
// import { urlList } from "./dummyData";

function App() {


  return (
    <UrlProvider>
      <div className='flex flex-col items-center w-screen min-h-screen h-fit p-4 bg-black text-white gap-8'>
        <h1 className='mt-[15%] text-4xl font-black'>URL Shortener</h1>
        <div className='flex flex-col items-center w-full max-w-[600px] gap-4'>
          <Input/>
          <Shorturl/>
        </div>
        <ListView/>
      </div>
    </UrlProvider>
  )
}

export default App
