'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2Icon, CreditCard, FileText, Calendar, Image as ImageIcon, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { format } from 'date-fns'

interface UserData {
    id: number
    name: string
    email: string
    credits: number
}

interface SessionChat {
    id: number
    sessionId: string
    notes: string
    selectedDoctor: {
        specialist: string
        description: string
    }
    conversation: any
    report: any
    createdBy: string
    createdOn: string
    imageFileName?: string
    imageFileType?: string
}

export default function ProfilePage() {
    const { user, isLoaded: isUserLoaded } = useUser()
    const router = useRouter()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [sessionHistory, setSessionHistory] = useState<SessionChat[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (isUserLoaded && user) {
            fetchUserData()
            fetchSessionHistory()
        }
    }, [isUserLoaded, user])

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/api/users/${user?.primaryEmailAddress?.emailAddress}`)
            setUserData(response.data)
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    const fetchSessionHistory = async () => {
        try {
            const response = await axios.get(`/api/sessions/user/${user?.primaryEmailAddress?.emailAddress}`)
            setSessionHistory(response.data)
        } catch (error) {
            console.error('Error fetching session history:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isUserLoaded || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2Icon className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                            <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                            <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {userData?.name || user?.fullName || 'User'}
                            </h1>
                            <p className="text-gray-600 mb-4">{user?.primaryEmailAddress?.emailAddress}</p>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Badge variant="secondary" className="px-4 py-2">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    {userData?.credits || 0} Credits
                                </Badge>
                                <Badge variant="secondary" className="px-4 py-2">
                                    <FileText className="w-4 h-4 mr-2" />
                                    {sessionHistory.length} Consultations
                                </Badge>
                                <Badge variant="secondary" className="px-4 py-2">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Joined {format(new Date(user?.createdAt || Date.now()), 'MMM yyyy')}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => router.push('/billing')}
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Buy Credits
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                            >
                                New Consultation
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">Consultation History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Consultations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{sessionHistory.length}</p>
                                <p className="text-xs text-gray-500 mt-1">All time</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">
                                    {sessionHistory.filter(session => {
                                        const sessionDate = new Date(session.createdOn)
                                        const now = new Date()
                                        return sessionDate.getMonth() === now.getMonth() &&
                                            sessionDate.getFullYear() === now.getFullYear()
                                    }).length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Consultations</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">Images Analyzed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">
                                    {sessionHistory.filter(session => session.imageFileName).length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Medical images</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your last 5 consultations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {sessionHistory.slice(0, 5).map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/dashboard/medical-agent/${session.sessionId}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {session.selectedDoctor?.specialist || 'Consultation'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(session.createdOn), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        {session.imageFileName && (
                                            <Badge variant="secondary" className="text-xs">
                                                <ImageIcon className="w-3 h-3 mr-1" />
                                                Image
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Consultations</CardTitle>
                            <CardDescription>Complete history of your medical consultations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sessionHistory.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No consultations yet</p>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push('/dashboard')}
                                        className="mt-2"
                                    >
                                        Start your first consultation
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sessionHistory.map((session) => (
                                        <div
                                            key={session.id}
                                            className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => router.push(`/dashboard/medical-agent/${session.sessionId}`)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {session.selectedDoctor?.specialist || 'Medical Consultation'}
                                                        </h3>
                                                        {session.imageFileName && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                <ImageIcon className="w-3 h-3 mr-1" />
                                                                Image Analysis
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                        {session.notes || session.selectedDoctor?.description || 'No description available'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(new Date(session.createdOn), 'MMMM d, yyyy at h:mm a')}
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}