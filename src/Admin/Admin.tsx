import React from 'react'
import { useQuery } from 'react-query';
import { getHelloAdmin } from '../API/Api';

function Admin() {

  const { isLoading, data } = useQuery<String>("ADmin", getHelloAdmin);

  return (
    <div>Admin, {data}</div>
  )
}

export default Admin