import AppLayout from '../../../components/AppLayout'
import useRequireAuth from '../../../lib/useRequireAuth'
import prisma from '../../../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import {useState} from 'react'
import Loader from '../../../components/Loader'

export default function Settings ({publication, rootUrl}) {

    const [customDomain, setCustomDomain] = useState(publication.customDomain ? publication.customDomain : null)
    const [saveStatus, setSaveStatus] = useState('Save')

    const session = useRequireAuth()
    if (!session) return <Loader/>

    async function addCustomDomain(domain, publicationId) {
        setSaveStatus('Saving...')
        const res = await fetch(`/api/add-custom-domain?domain=${domain}&publicationId=${publicationId}`)
        if (res.ok) {
            setSaveStatus('Saved!')
        }
    }

    return (
        <>
            <AppLayout
                name={session?.user?.name}
                email={session?.user?.email}
                image={session?.user?.image}
            >
                <div className="w-7/12 mx-auto grid grid-cols-4 gap-10 h-screen divide-x">
                    <div className="pt-10 col-span-1">
                        <Link href='/'>
                            <a className="text-left font-semibold text-lg">
                                ← All Publications 
                            </a>
                        </Link>
                        <a href={`https://${publication.url}.${rootUrl}`} target="_blank">
                            <div className="relative mx-auto mt-5 mb-3 w-16 h-auto rounded-xl overflow-hidden">
                                <Image 
                                    width={80}
                                    height={80}
                                    src='/logo.svg'
                                />
                            </div>
                            <p className="text-center font-medium">{publication.name}</p>
                        </a>

                        <div className="text-left grid grid-cols-1 gap-6 mt-10">
                            <Link href={`/publication/${publication.id}/`}>
                                <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Posts
                                </a>
                            </Link>
                            <Link href={`/publication/${publication.id}/drafts`}>
                                <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Drafts
                                </a>
                            </Link>
                            <Link href={`/publication/${publication.id}/settings`}>
                                <a className="font-semibold text-gray-900 bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Settings
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="pt-16 pb-20 pl-10 col-span-3">
                        <div className="flex justify-between">
                            <h1 className="font-bold text-3xl m-5 mb-10">
                                Settings
                            </h1>
                        </div>
                        <div className="sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:py-5">
                            <div className="sm:grid sm:grid-cols-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Name
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <input
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    required
                                    defaultValue={publication.name}
                                    className="rounded-md border border-solid border-gray-300  w-full focus:outline-none min-w-0 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex justify-end mt-3">
                                <button 
                                    //onClick={() => }
                                    className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className="sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:py-5">
                            <div className="sm:grid sm:grid-cols-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Subdomain
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <div className="max-w-lg flex rounded-md shadow-sm border border-solid border-gray-300">
                                        <input
                                        type="text"
                                        name="subdomain"
                                        autoComplete="off"
                                        required
                                        defaultValue={publication.url}
                                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none border rounded-l-md sm:text-sm border-gray-300"
                                        />
                                        <span className="inline-flex items-center px-3 w-1/2 rounded-r-md border-t-0 border-r-0 border-b-0 border border-l-1 border-gray-300 bg-gray-100 text-gray-600 sm:text-sm">
                                        .{rootUrl}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-end mt-3">
                                <button 
                                    //onClick={() => }
                                    className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className="sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:py-5">
                            <div className="sm:grid sm:grid-cols-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Custom domain
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <div className="max-w-lg flex rounded-md shadow-sm border border-solid border-gray-300">
                                    <input
                                    type="text"
                                    name="subdomain"
                                    autoComplete="off"
                                    required
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    defaultValue={customDomain}
                                    placeholder="mydomain.com"
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 border rounded-md sm:text-sm border-gray-300"
                                    />
                                </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-between mt-3">
                                <p className="text-sm text-indigo-600 mt-5">Note: This can take anywhere between 5-10 minutes to take effect.</p>
                                <button 
                                    onClick={() => addCustomDomain(customDomain, publication.id)}
                                    className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                                >
                                    {saveStatus}
                                </button>
                            </div>
                        </div>


                        <div className="sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:py-5">
                            <div className="sm:grid sm:grid-cols-4">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Description
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <textarea
                                        name="description"
                                        rows={3}
                                        defaultValue={publication.description}
                                        placeholder="The hottest gossip about armadilos"
                                        className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex justify-end mt-3">
                                <button 
                                    //onClick={}
                                    className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                                >
                                    Save
                                </button>
                            </div>    
                        </div> 
                    </div>
                </div>
            </AppLayout>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const { id } = ctx.query;  
    const { req, res } = ctx
    const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : process.env.CURR_SLUG
    if (subdomain == process.env.APP_SLUG) {
        const publication = await prisma.publication.findUnique({
            where: {
                id: id
            }
        }) 
        return {
            props: {
                publication: publication,
                rootUrl: process.env.ROOT_URL
            }
        }
    } else {
        return {
            redirect: {
                destination: '/',
                statusCode: 302
            }
        }
    }
}