import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
const ScheduleTask = () => {
      const [bookingDate, setBookingDate] = useState(new Date());
       const [purpose, setPurpose] = useState('');
     

        const handleBook = () => {
    if ( !bookingDate ||  !purpose ) return;
    console.log({  bookingDate, purpose});
    alert('Task Added SuccessFully!');
  };
  return (


    <Card className="p-4 mt-4">
          <h3 className="text-xl font-semibold mb-2">Schdeule your Task </h3>
        
          <div className="grid gap-4">
            <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} disabled={{ before: new Date() }} />


            <Textarea
              placeholder="Purpose of booking"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
         

            <Button onClick={handleBook} style={{ color: 'black' }}> Schedule Task</Button>
          </div>
        </Card>
  )
}

export default ScheduleTask
