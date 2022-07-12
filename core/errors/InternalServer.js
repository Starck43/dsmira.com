import React from 'react'
import Layout from './layout'

const InternalServer = () => {
  return (
    <Layout
      title={'Внутренняя ошибка сервера 500'}
      description={
        'Ваш запрос на сервер не может быть обработан по причине внутренней ошибки скриптов.\
         Для устранения ошибки нужно обратиться к администратору сайта.'
      }
    />
  )
}

export default InternalServer
