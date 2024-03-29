import React from 'react'
import {useAuth} from './useAuth'

type Props = {
    roleRequired: string,
    children? : React.ReactNode
}

const WithPermission = ({roleRequired, children}: Props) => {
    const conta  = useAuth();
    return(
        <>
            {roleRequired === conta?.role && children}
        </>
    )
}

export default WithPermission