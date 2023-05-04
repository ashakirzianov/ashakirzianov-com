import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ReactGA from 'react-ga'

const useGoogleAnalytics = (trackingId: string) => {
    const router = useRouter()

    useEffect(() => {
        if (trackingId) {
            ReactGA.initialize(trackingId)
        }
    }, [trackingId])

    useEffect(() => {
        if (trackingId) {
            const logPageView = () => {
                ReactGA.set({ page: window.location.pathname })
                ReactGA.pageview(window.location.pathname)
            }

            logPageView()
            router.events.on('routeChangeComplete', logPageView)

            return () => {
                router.events.off('routeChangeComplete', logPageView)
            }
        }
    }, [router.events, trackingId])
}

export default useGoogleAnalytics
