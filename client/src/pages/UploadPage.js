import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useHistory} from 'react-router-dom'
import axios from "axios";
import download from 'downloadjs'

export const UploadPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {request} = useHttp()
    const [link, setLink] = useState('')
    const [files, setFiles] = useState([])
    const [uploadFile, setUploadFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const reqFiles = async () => {
        const data = await request('/api/uploads/all', 'GET')
        setFiles(data)
    }
    useEffect(async () => {
        window.M.updateTextFields()
        await reqFiles()
    }, [])

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer ${auth.token}`
                })
                history.push(`/detail/${data.link._id}`)
            } catch (e) {
            }
        }
    }

    const postFile = async (e) => {

        e.preventDefault()
        const formData = new FormData()
        formData.append('file', uploadFile)
        formData.append('title', title)
        formData.append('description', description)
        let res = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        await reqFiles()
    }
    const getFile=async (id,path,mimetype)=>{
        const res = await axios.get(`api/upload/${id}`,{
            responseType:'blob'
        })
        const split = path.split('/')
        const filename = split[split.length - 1];
        return download(res.data, filename, mimetype);

    }
    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <form onSubmit={e => postFile(e)}>
                        <input type={'text'}
                               onChange={(e) => setTitle(e.target.value)}
                               placeholder={'Название файла'}/>
                        <input type={'text'}
                               onChange={(e) => setDescription(e.target.value)}
                               placeholder={'Описание файла'}/>
                        <input
                            placeholder="Загрузите файл"
                            type="file"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                        />
                        <button className={'btn'} onSubmit={postFile}>Загрузить файл</button>
                    </form>

                    {files.map(el =>
                        <div key={el._id}>
                            <p>Название: {el.title}</p>
                        <div>Описание: {el.description}</div>
                            <button onClick={(e)=>getFile(el._id,el.file_path,el.file_mimetype)}>Загрузить</button>
                    </div>)}
                </div>
            </div>
        </div>
    )
}