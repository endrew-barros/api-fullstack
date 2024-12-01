//dafault quer dizer que a função é padrão diferente quando utilizamos somente o export =>
//nisso quando importamos em outro arquivo utiliza essa forma de declarar 
import { FormEvent, useEffect, useRef, useState } from 'react'
import { FiTrash } from "react-icons/fi";
import { api } from './services/api'

interface CustomerProps {
  id: string
  name: string
  email: string
  status: string
  created_at: string
}
//import {app} <from local onde está>
export default function app() {
  const [customers, setCustomer] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const response = await api.get("/customers")
    setCustomer(response.data)
  }
  async function HandleSubmit(event: FormEvent) {
    event.preventDefault()//serve para atualizar a página
    
    if (!nameRef.current?.value || !emailRef.current?.value) return

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })
    // passado na fase de teste de retorno de dados 
    console.log(response.data)
    //passamos a adicionar sem necessitar atualizar a página com f5
    setCustomer( allCustomer => [...allCustomer, response.data])
    //limpar os campos
     nameRef.current.value = ''
    emailRef.current.value = ''
  }
  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        }
      })
      const allCustomers = customers.filter((customer) => customer.id !== id)
      setCustomer(allCustomers)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={HandleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome..."
            className="w-full mb-5 p-2 rounded"
            ref={nameRef} />

          <label className="font-medium text-white">Email:</label>
          <input
            type="text"
            placeholder="Digite seu email..."
            className="w-full mb-5 p-2 rounded"
            ref={emailRef} />
          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium" />
        </form>
        <section className="flex flex-col gap-5">
          {/* javascript {} */}
          {customers.map((customer) => (
            <article key={customer.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
              <p><span className="font-medium">Nome:</span>{customer.name}</p>
              <p><span className="font-medium">Email:</span>{customer.email}</p>
              <p><span className="font-medium">Status:</span>{customer.status ? "ATIVO" : "INATIVO"}</p>
              <button className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
                onClick={() => handleDelete(customer.id)}
              >
                <FiTrash size={18} color="#fff" />
              </button>
            </article>
          ))}

        </section>
      </main>
    </div>
  )
} 