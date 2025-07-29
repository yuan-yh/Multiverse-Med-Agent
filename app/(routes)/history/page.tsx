'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { format } from 'date-fns'
import {
    FileText,
    Calendar,
    Search,
    Filter,
    Download,
    Eye,
    Image as ImageIcon,
    ChevronDown,
    Clock,
    User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import { IconArrowRight } from '@tabler/icons-react'

// Define the session type based on your schema
interface SessionDetail {
    id: number
    sessionId: string
    notes: string
    selectedDoctor: {
        specialist: string
        description: string
        image?: string
    }
    conversation: any
    report: any
    createdBy: string
    createdOn: string
    imageData?: string
    imageFileName?: string
    imageFileType?: string
}

export default function HistoryPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [historyList, setHistoryList] = useState<SessionDetail[]>([])
    const [filteredList, setFilteredList] = useState<SessionDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')

    useEffect(() => {
        if (isLoaded && user) {
            getHistoryList()
        }
    }, [isLoaded, user])

    useEffect(() => {
        filterHistory()
    }, [searchTerm, filterType, historyList])

    const getHistoryList = async () => {
        try {
            const result = await axios.get('/api/session-chat?sessionId=all')
            setHistoryList(result.data)
            setFilteredList(result.data)
        } catch (error) {
            console.error('Error fetching history:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterHistory = () => {
        let filtered = historyList

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(session =>
                session.selectedDoctor?.specialist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.notes?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply type filter
        if (filterType === 'with-images') {
            filtered = filtered.filter(session => session.imageFileName)
        } else if (filterType === 'recent') {
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            filtered = filtered.filter(session =>
                new Date(session.createdOn) > oneWeekAgo
            )
        }

        setFilteredList(filtered)
    }

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMins = Math.floor(diffInMs / 60000)
        const diffInHours = Math.floor(diffInMs / 3600000)
        const diffInDays = Math.floor(diffInMs / 86400000)

        if (diffInMins < 60) return `${diffInMins} minutes ago`
        if (diffInHours < 24) return `${diffInHours} hours ago`
        if (diffInDays < 7) return `${diffInDays} days ago`
        return format(date, 'MMM d, yyyy')
    }

    if (!isLoaded || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Consultation History</h1>
                    <p className="text-gray-600 mt-1">Review your past medical consultations and reports</p>
                </div>
                <Button
                    className={`mt-3 transition-all duration-200 bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500 text-white 
                        hover:shadow-md hover:-translate-y-0.5`}
                    onClick={() => router.push('/dashboard')}
                    size="sm"
                >
                    New Consultation
                    <IconArrowRight className='w-4 h-4' />
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Consultations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">{historyList.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">
                            {historyList.filter(s => {
                                const date = new Date(s.createdOn)
                                const now = new Date()
                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                            }).length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">With Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">
                            {historyList.filter(s => s.imageFileName).length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Specialists</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">
                            {new Set(historyList.map(s => s.selectedDoctor?.specialist)).size}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search by specialist or notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="min-w-[150px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterType('all')}>
                                    All Consultations
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterType('recent')}>
                                    Last 7 days
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterType('with-images')}>
                                    With Images
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            {/* History Table/List */}
            {filteredList.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="max-w-sm mx-auto">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchTerm || filterType !== 'all' ? 'No matching consultations' : 'No consultations yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || filterType !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Start your first consultation with our AI medical specialists'
                                }
                            </p>
                            {(!searchTerm && filterType === 'all') && (
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                >
                                    Start Consultation
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Consultation Records</CardTitle>
                        <CardDescription>
                            Showing {filteredList.length} of {historyList.length} consultations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Specialist</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Attachments</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredList.map((session) => (
                                        <TableRow key={session.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {session.selectedDoctor?.specialist || 'General Consultation'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ID: {session.sessionId.slice(0, 8)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-gray-600 line-clamp-2 max-w-xs">
                                                    {session.notes || 'No notes available'}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm">{getTimeAgo(session.createdOn)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {session.imageFileName ? (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <ImageIcon className="w-3 h-3 mr-1" />
                                                        Image
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">None</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/dashboard/medical-agent/${session.sessionId}`)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    {session.report && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {/* Add download logic */ }}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}