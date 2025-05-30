import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const itemincart = ({ item }) => {
    const [isitem, setisitem] = useState(true)
    const cart = useSelector(state => state.cart);
    const itemincart = cart.items.find((cartitem) => cartitem.id === item.id)
    if (itemincart) {
        setisitem(true)
    } else {
        setisitem(false)
    }
    return isitem
}

export default itemincart