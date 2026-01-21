import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import TrainList from './pages/TrainList';
import MyBookings from './pages/MyBookings';
import PNRStatus from './pages/PNRStatus';
import AgentLogin from './pages/AgentLogin';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import Loyalty from './pages/Loyalty';
import EWallet from './pages/EWallet';
import Buses from './pages/Buses';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Holidays from './pages/Holidays';
import Meals from './pages/Meals';
import Promotions from './pages/Promotions';
import More from './pages/More';
import ContactUs from './pages/ContactUs';
import LiveTracking from './pages/LiveTracking';
import MyTransactions from './pages/MyTransactions';
import AdminDashboard from './pages/AdminDashboard';

import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/agent" element={<AgentLogin />} />
          <Route path="/trains" element={<TrainList />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/my-transactions" element={<MyTransactions />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/pnr/:pnr" element={<PNRStatus />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/e-wallet" element={<EWallet />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/more" element={<More />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </LanguageProvider>
  );
}

export default App;
