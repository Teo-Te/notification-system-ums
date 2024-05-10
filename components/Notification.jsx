'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [students , setStudents] = useState([])
  const [time, setTime] = useState(new Date())
  const [ip, setIp] = useState('')
  const [notificationSent2, setNotificationSent] = useState(false)
  const [notificationEndTime, setNotificationEndTime] = useState('')

  // Get the ip address
  useEffect(() => {
    const getIp = async () => {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIp(data.ip)
    }
    getIp()
  })

  // Classes and their students
  const classes = [
    {id: 1, course: 'Calculus', professor:'Mr. Jari', schedule: {day: 'Friday', time: '22:13'}, students: ['Klejdi', 'Flogu', 'Teo']},
    {id: 2, course: 'Calculus', professor:'Mr. Jari', schedule: {day: 'Monday', time: '10:0'}, students: ['Klejdi', 'Flogu', 'Teo']},
    {id: 3, course: 'Physics', professor:'Mr. Jarani', schedule: {day: 'Friday', time: '22:13'}, students: ['Ledi', 'Meri']},
    {id: 4, course: 'Physics', professor:'Mr. Jarani', schedule: {day: 'Friday', time: '10:0'}, students: ['Ledi', 'Meri']},
  ]

  // Get the classes that are happening now
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now)
      const day = now.toLocaleString('en-us', {weekday: 'long'})
      const hour = now.getHours()
      const minute = now.getMinutes()
      const currentTime = `${hour}:${minute}`
      const currentClasses = classes.filter(c => c.schedule.day === day && c.schedule.time === currentTime)
      // Only update students state if current classes have changed
      if (JSON.stringify(currentClasses) !== JSON.stringify(students.map(s => ({ course: s.course, professor: s.professor })))) {
        const newStudents = currentClasses.flatMap(c => c.students.map(student => ({
          student,
          course: c.course,
          professor: c.professor,
          classStartTime: c.schedule.time
        })))
        setStudents(newStudents)
      }
  
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
   // if (ip === '213.207.39.216') {
      if (students.length > 0) {
        const now = new Date()
        setNotificationEndTime(new Date(now.getTime() + 5 * 60000))
        console.log(notificationEndTime)
        if (now <= notificationEndTime) {
          students.forEach(({student, course, professor}) => {
            if (!notificationSent2) {
              console.log(`Notification: Dear ${student}, your class ${course} with ${professor} is starting now. Are you present?`)
              setNotificationSent(true)
              setNotificationEndTime(new Date(now.getTime() + 5 * 60000))
            }
          })
          setStudents(students)
        }
      }
    //} else {
    //  console.log('You are not connected to CIT Wifi Network.')
    //}
  }, [students, ip])


  return (
    <div>
      <h1>Notification System</h1>
    </div>
  );
}
