import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback(text => {
        if(text) console.log(text)
    }, [])
}