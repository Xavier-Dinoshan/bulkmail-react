import axios from 'axios'
import { useState } from 'react'
import * as XLSX from 'xlsx'

function App() {

  const [msg, setMsg] = useState("")
  const [stetus, setStetus] = useState(false)
  const [emailList, setEmailList] = useState([])
  
  function message(evt) {
    setMsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = function (e) {
      const data = e.target.result

      const workbook = XLSX.read(data, { type: "binary" })

      const sheetName = workbook.SheetNames[0]

      const worksheet = workbook.Sheets[sheetName]

      const emailLists = XLSX.utils.sheet_to_json(worksheet, { Header: 'A' })

      const totalemail = emailLists.map(function(item){return item.Emails})

      console.log(totalemail);

      setEmailList(totalemail)







    }

    reader.readAsBinaryString(file)
  }

  function send() {
    setStetus(true)
    axios.post("http://localhost:5000/sendmail", { msg: msg, emailList: emailList }).then(
      function (data) {
        if (data.data == true) {
          alert("Send Successfully")
          setStetus(false)
        }
        else {
          alert("failed")
        }
      }
    )
    
    setMsg("")
  }

  return (
    <div>
      <div className='bg-blue-950 text-white text-center'>
        <h1 className='text-2xl font-medium px-5 py-3' >Bulkmail</h1>
      </div>

      <div className='bg-blue-800 text-white text-center'>
        <h1 className=' font-medium px-5 py-3' >We can Help your Business with sending multiple emails at once</h1>
      </div>

      <div className='bg-blue-600 text-white text-center'>
        <h1 className=' font-medium px-5 py-3' >Drag and Drop</h1>
      </div>

      <div className='bg-blue-400 text-black flex flex-col items-center py-3 text-center'>
        <textarea onChange={message} value={msg} className='w-[80%] h-32 outline-none py-2 px-2 border border-black rounded-md' placeholder='Enter the email text....'></textarea>

        <div>
          <input onChange={handlefile} type="file" className='border-4 border-dashed p-4 my-5 ' />

          <p>Total Email in the file: {emailList.length}</p>

          <button onClick={send} className='bg-blue-950 p-2 text-white rounded-md w-fit mt-4'>{stetus?"sending...":"send"}</button>
        </div>


      </div>

      <div className='bg-blue-300 h-20'></div>

      <div className='bg-blue-200 h-20'></div>

      <div className='bg-blue-100 h-10'></div>

      
    </div>
  )
}

export default App
