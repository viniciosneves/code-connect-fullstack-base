import Link from 'next/link'
import { Heading } from '@/components/Heading'
import Image from 'next/image'

import banner from './not-found/404.png'
import style from './not-found/not-found.module.css'
import { ArrowBack } from '@/components/icons/ArrowBack'

export default async function NotFound() {
  return (
    <div className={style['not-found']}>
      <Image src={banner}/>
      <Heading>OPS! Página não encontrada.</Heading>
      <p className={style.text}>Você pode voltar ao feed e continuar buscando projetos incríveis!</p>
      <Link href="/">
        Voltar ao feed <ArrowBack color='#81FE88'/>
      </Link>
    </div>
  )
}