import express from 'express';

const app = express();

const port = 3100;

app.use(express.static("public"));

app.use(express.json());

let room =[
  {
    roomId:"1",
    roomName:"Room A",
    seats:"50",
    pricePerHour:"Rs.200"
  },
  {
    roomId:"2",
    roomName:"Room B",
    seats:"50",
    pricePerHour:"Rs.200"
  },
  {
    roomId:"3",
    roomName:"Room C",
    seats:"50",
    pricePerHour:"Rs.200"
  }

];
let booking=[
  {
    bookingId:"1R",
    customerName:"sai",
    dateOfBooking:"20/10/2023",
    starttime:"10am",
    endtime:"6pm",
    roomId:"1"
  },
  {
    bookingId:"2R",
    customerName: "raj",
   dateOfBooking: "28/10/2023",
    starttime: "4pm",
    endtime: "10pm",
    roomId: "2"
},
{
  bookingId:"3R",
  customerName:"sai",
  dateOfBooking:"25/10/2023",
  starttime:"10am",
  endtime:"6pm",
  roomId:"1"
},
{
  bookingId:"4R",
  customerName:"sai",
  dateOfBooking:"28/10/2023",
  starttime:"10am",
  endtime:"6pm",
  roomId:"2"
}
]

///creating room
app.post('/rooms', (req,res)=>{
  try{
    room.push(req.body)
    res.send(room)
    console.log("Room created successfully");
  }
  catch{
    console.log(err);
    res.status(500).send('Internal Server Error');
  } 
});


app.get('/rooms', (req,res)=>{
  try{
    res.send(room)
  }
  catch{
    console.log(err);
    res.status(500).send('Internal Server Error');
  } 
});

////Booking room
app.post('/bookingroom', (req,res)=>{
  try{

    if(booking.date !== booking.date && booking.starttime !== booking.starttime && booking.endtime !== booking.endtime){
    booking.push(req.body)
    res.send(booking)
    console.log("Room booked successfully");
    }
    else{
      res.status(400).send("the room is already booked on the date and time")
    }
  }
  catch{
    console.log(err);
    res.status(500).send('Internal Server Error');
  } 
});

app.get('/bookingroom', (req,res)=>{
  try{
    res.send(booking)
  }
  catch{
    console.log(err);
  } 
});

/////Listing rooms

app.get('/rooms-with-booking', (req, res) => {
  try {
    const roomsWithBooking = room.map((r) => {
      const bookingInfo = booking.find((b) => b.roomId === r.roomId);
      return {
        roomName: r.roomName,
        bookedStatus: bookingInfo ? 'Booked' : 'Available',
        customerName: bookingInfo ? bookingInfo.customerName : 'N/A',
        bookedDate: bookingInfo ? bookingInfo.dateOfBooking : 'N/A',
        startTime: bookingInfo ? bookingInfo.starttime : 'N/A',
        endTime: bookingInfo ? bookingInfo.endtime : 'N/A',
      };
    });

    res.send(roomsWithBooking);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

//list of customers

app.get('/customers', (req, res) => {
  try {
    const customersWithBooking = booking.map((b) => {
      const roomInfo = room.find((r) => r.roomId === b.roomId);
      return {
        customerName: b.customerName,
        roomName: roomInfo ? roomInfo.roomName : 'N/A',
        date: b.dateOfBooking,
        startTime: b.starttime,
        endTime: b.endtime,
      };
    });

    res.send(customersWithBooking);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

///list of customer booking count
app.get('/customerbookings', (req, res) => {
  try {
    const customerBookingCount = booking.reduce((acc, bookingInfo) => {
      const roomInfo = room.find((r) => r.roomId === bookingInfo.roomId);

      const customerName = bookingInfo.customerName;
      const roomName = roomInfo ? roomInfo.roomName : 'N/A';
      const bookedStatus = roomInfo ? 'Booked' : 'Cancelled';

      const existingEntry = acc.find((entry) => entry.customerName === customerName && entry.roomName === roomName);

      if (existingEntry) {
        existingEntry.bookingIds.push(bookingInfo.bookingId);
        existingEntry.bookingDates.push(bookingInfo.dateOfBooking);
        existingEntry.bookingstatus.push(bookedStatus);
        existingEntry.count += 1;
      } else {
        acc.push({
          customerName,
          roomName,
          bookingIds: [bookingInfo.bookingId],
          bookingDates: [bookingInfo.dateOfBooking],
          bookingstatus: [bookedStatus],
          count: 1,
        });
      }
   
      return acc;
    }, []);

    res.send(customerBookingCount);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
console.log('Application Started on port 3100');
  });
