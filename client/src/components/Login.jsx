import React from "react"

export const Login = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const submitForm = () => {

    }
    return (
        <div>
            <form onSubmit={submitForm}>
                <input type={'text'} value={login} onChange={(e) => setLogin(e.target.value)} name={'Login'}
                       placeholder={'Введите логин'}/>
                <input type={'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                       placeholder={'Введите пароль'}/>

            </form>
        </div>
    )
}