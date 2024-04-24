import {React, useEffect, useState } from "react";
import { Row, Col, Divider, DatePicker, Checkbox, Modal, Select, Form, Input, Button } from "antd";
import {
  DollarCircleOutlined,
  TagsOutlined,
  CarOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import StripeCheckout from "react-stripe-checkout";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsAction";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import { bookCar, bookCarUsingCash } from "../redux/actions/bookingActions";
import Footer from "./Footer";
import { verifyUser } from "../redux/actions/userActions";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
function BookingCar() {
  const { id } = useParams();
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [car, setcar] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalMins, setTotalmins] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [sameAddress, setSameAddress] = useState(false);
  const handleVerifyUser = (values) =>{
    const reqObj = {...values, car: car._id, _id: JSON.parse(localStorage.getItem("user"))._id}
    console.log(reqObj);
      dispatch(verifyUser(reqObj ));
  }
  const onFinishPickUpAddress = (values) => {
    console.log("onfinishpickupaddress")
    setPickUpPoint(values)
    setModal(!modal);
    setModal2(!modal2);
  }
  

  const indiaStates = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];
  const onChange = () =>{
    setSameAddress(!sameAddress);
  }
  const onFinish = (values) => {
    console.log(values)
  }
  const handleNext = () => {
    if(JSON.parse(localStorage.getItem("user")).isVerifiedUser)
        setModal(!modal);
    else{
      setModal3(!modal3);
    }
  }
  const [showModal, setShowModal] = useState(false);
  const [payment, setPayment] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [pickUpPoint, setPickUpPoint] = useState("");

  const handleDropPointFinish = (values) => {
    const reqObj = sameAddress ?  {
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: id,
      totalMins,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
      pickupPoint :{
        pickUpPoint
      },
      dropPoint: {
        dropPoint: {...pickUpPoint}
      },
      transactionType: "Cash"
    } : 
    {
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: id,
      totalMins,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
      pickupPoint :{
        pickUpPoint
      },
      dropPoint: {
        dropPoint: {...values}
      },
      transactionType: "Cash"
    }
    dispatch(bookCarUsingCash(reqObj));
  }
  const handleChange = () => {
    setPayment(!payment);
  }
  useEffect(() => {
    if (cars.length == 0) {
      dispatch(getAllCars());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setcar(cars.find((o) => o._id == id));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }


  }, [cars]);
  useEffect(() => {
    setTotalAmount(Math.round(totalMins * (car.rentPerHour / 60)));
    console.log(totalHours*Math.ceil(car.rentPerHour));
    if (driver) {
      setRemainingMinutes(totalMins - (totalHours * 60));
      setTotalAmount(totalAmount + 5 * totalMins);
    }
    console.log(totalMins+ " " + totalHours + " " + remainingMinutes);
  }, [driver, totalMins, totalHours, remainingMinutes]);
  useEffect(() =>{
    console.log(from + " " + to);
  }, [from, to])
  function selectTimeSlots(values) {
    if (values) {
      setFrom(moment(values[0]).format("MMM DD yyyy HH mm"));
      setTo(moment(values[1]).format("MMM DD yyyy HH mm"));
      setTotalHours(values[1].diff(values[0], 'hours'));
      setTotalDays(values[1].diff(values[0], 'days'))
      setTotalmins(values[1].diff(values[0], "minutes"));
    } else {
      setTotalmins(0);
    }
  }
  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: id,
      totalMins,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
      transactionType: "Card"
    };

    dispatch(bookCar(reqObj));
  }
  //const labelStyle = { color: 'black' };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };
  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24}>
          <img src={car.image} alt={car.name} className="carimg2 bs2" />
        </Col>
        <Col
          lg={10}
          sm={24}
          xs={24}
          style={{ marginLeft: "65px", bottom: "10px" }}
        >
          <div
            style={{
              // backgroundColor: "#24ffffc9",
              backgroundColor: "#28d8d8",
              borderRadius: "10px",
              // maxHeight: "400px",
              width: "90%",
            }}
          >
            <Divider>
              <h4 style={{ color: "white" }}>DETAILS</h4>
            </Divider>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "0.5px",
                marginRight: "0.5px",
              }}
            >
              <div style={{ margin: "4px" }} className="car-headings">
                <p style={{ display: "flex", flexDirection: "row" }}>
                  <span className="booking-icons">
                    <TagsOutlined />
                  </span>
                  <span className="car-data">Brand</span>
                </p>
                <p style={{ display: "flex", flexDirection: "row" }}>
                  <span className="booking-icons">
                    <TagsOutlined />
                  </span>
                  <span className="car-data">Model</span>
                </p>
                <p style={{ display: "flex", flexDirection: "row" }}>
                  <span className="booking-icons">
                    <DollarCircleOutlined />
                  </span>
                  <span className="car-data">Rent</span>
                </p>
                <p style={{ display: "flex", flexDirection: "row" }}>
                  <span className="booking-icons">
                    <CarOutlined />
                  </span>
                  <span className="car-data">Fuel Type</span>
                </p>
                <p style={{ display: "flex", flexDirection: "row" }}>
                  <span className="booking-icons">
                    <UsergroupAddOutlined />
                  </span>
                  <span className="car-data">Max Persons</span>
                </p>
              </div>
              <div className="car-headData">
                <p>
                  <span className="car-data2">{car.brand}</span>
                </p>
                <p>
                  <span className="car-data2">{car.modelName}</span>
                </p>
                <p>
                  <span className="car-data2">{car.rentPerHour} Rs/-</span>
                </p>
                <p>
                  <span className="car-data2">{car.fuelType}</span>
                </p>
                <p>
                  <span className="car-data2">{car.capacity}</span>
                </p>
              </div>
            </div>
            <Divider>
              <h4 style={{ color: "white" }}>SELECT TIME SLOTS</h4>
            </Divider>
            <div>
              <RangePicker
                className="RangePicker"
                showTime={{ format: "HH:mm a" }}
                format="MMM DD yyyy HH:mm"
                onChange={selectTimeSlots}
                disabledDate={disabledDate}
              />
              {/* <RangePicker disabledDate={disabledDate} /> */}
              <br />
              <button
                className="btn1 mt-2 mb-2"
                style={{
                  marginBottom: "4px",
                  borderRadius: "5px",
                  outline: "none",
                  border: "none",
                }}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                See Booked Slots
              </button>
              {from && to && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    marginRight: "56px",
                    color: "white",
                  }}
                >
                  
                  <p>
                    Total hours : <b>{totalHours}</b>
                  </p>
                  <p>
                    Total hours : <b>{`${totalDays} Days & ${totalDays - totalHours/60} Hours.`}</b>
                  </p>

                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setdriver(true);
                      } else {
                        setdriver(false);
                      }
                    }}
                  >
                    <span style={{ color: "white" }}> Driver Required</span>
                  </Checkbox>
                  <h3 style={{ color: "white" }}>
                    Total Amount : {totalAmount}
                  </h3>
                  <span style={{ color: "white" }}>Payment Type</span>
                  <Select defaultValue="cash" style={{ width: 120, borderRadius: 100 }} onChange={handleChange}>
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="card">Card</Select.Option>
                  </Select>
                  {
                    payment ?
                      <StripeCheckout
                        token={onToken}
                        shippingAddress
                        billingAddress={true}
                        currency="inr"
                        amount={totalAmount * 100}
                        stripeKey="pk_test_51Oo1mESANYloZJkUPTX1FHWE0ppFhYsYVqxUfIyHhx8d2sNFaxFMTHIvIceUieF29gqBf33QgivcYwfLm8uHYwD300JHUzLN9x"
                      >
                        <button
                          className="btn1"
                          style={{
                            marginBottom: "4px",
                            borderRadius: "5px",
                            fontWeight: "500",
                            outline: "none",
                            border: "none",
                          }}

                        >
                          Next
                        </button>
                      </StripeCheckout>
                      :
                      <button
                        className="btn1"
                        style={{
                          marginBottom: "4px",
                          borderRadius: "5px",
                          fontWeight: "500",
                          outline: "none",
                          border: "none",
                        }}
                        // onClick={handleClick}
                        // Show modal by clicking
                        onClick={handleNext}

                      >
                        Next
                      </button>
                  }
                </div>
              )}
            </div>
          </div>
        </Col>
        {
          from && to &&
          <Modal
            visible={modal}
            closable={true}
            onCancel={() => { setModal(false); }}
            footer={false}
            title="Pick Up Address"
          >
            <Form
              style={{ color: "white" }}
              name="pick_address_form"
              onFinish={onFinishPickUpAddress}
              initialValues={{ country: 'USA' }}
              layout="vertical"
            >
              <Form.Item
                name="fullname"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your full name!' }]}
                style={{ color: "black" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address1"
                label="Address Line 1"

                rules={[{ required: true, message: 'Please enter your address!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address2"
                label="Address Line 2"

              >
                <Input />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter your city!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="state"
                label="State"

                rules={[{ required: true, message: 'Please select your state!' }]}
              >
                <Select>
                  {indiaStates.map((state) => (
                    <Select.Option value={state}>{state}</Select.Option>
                  ))}
                
                </Select>
              </Form.Item>

              <Form.Item
                name="zip"
                label="Zip Code"

                rules={[{ required: true, message: 'Please enter your zip code!' }]}
              >
                <Input />
              </Form.Item>


              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Next
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        }
        {
          from && to &&
          <Modal
            visible={modal2}
            closable={true}
            onCancel={() => {setModal2(false); }}
            footer={false}
            title="Drop Address"
          >
            <Checkbox onChange={onChange}>Same as Pick Up Point?</Checkbox>;
            {/* <p>Don't change If you want same as pick up point.</p> */}
            <Form
              style={{ color: "white" }}
              name="drop_address_form"
              onFinish={handleDropPointFinish}
              initialValues={{ country: 'USA' }}
              layout="vertical"
            >
              <Form.Item
                name="fullname"
                label="Full Name"
                rules={[{ required: !sameAddress, message: 'Please enter your full name!' }]}
                style={{ color: "black" }}
              >
                <Input disabled={sameAddress}/>
              </Form.Item>

              <Form.Item
                name="address1"
                label="Address Line 1"

                rules={[{ required: !sameAddress, message: 'Please enter your address!' }]}
              >
                <Input disabled={sameAddress} />
              </Form.Item>

              <Form.Item
                name="address2"
                label="Address Line 2"

              >
                <Input disabled={sameAddress}/>
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: !sameAddress, message: 'Please enter your city!' }]}
              >
                <Input disabled={sameAddress}/>
              </Form.Item>

              <Form.Item
                name="state"
                label="State"

                rules={[{ required: !sameAddress, message: 'Please select your state!' }]}
              >
                <Select>
                  {indiaStates.map((state) => (
                    <Select.Option disabled={sameAddress} value={state}>{state}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="zip"
                label="Zip Code"
                rules={[{ required: !sameAddress, message: 'Please enter your zip code!' }]}
                >
                
                <Input disabled={sameAddress} />
              </Form.Item>


              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        }
         <Modal
            visible={modal3}
            closable={true}
            onCancel={() => { setModal3(false); }}
            onFinish = {handleVerifyUser}
            footer={false}
            title="Verify the Driver"
         >
           <p>For Ex: HR-0619850034761</p>

          <Form
              style={{ color: "white" }}
              name="drop_address_form"
              onFinish={handleVerifyUser}
              layout="vertical"
            >
              <Form.Item
                name="aadharNumber"
                label="Enter 12 digit aadhar number"
                rules={[{ required: true, message: 'Please enter your Valid Aadhar Number!' , 
                pattern: "^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$"}]}
                style={{ color: "black" }}
              >
                <Input />
              </Form.Item>

            
              <Form.Item
                name="drivingLicense"
                label="Enter Driving License Number"
                
                rules={[{required: true, message: "Please Provide Valid Driving License", pattern:  "^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$"}]}
                >
                <Input placeholder="DD-MM-YYYY"/>
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Date Of Birth"
                
                rules={[{required: true, message: "Please Provide Valid D.O.B.", pattern:  "^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.](19|20)\\d\\d$"}]}
              >
                <Input placeholder="DD-MM-YYYY"/>
              </Form.Item>


              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
         </Modal>
        {car.modelName && (
          <Modal
            visible={showModal}
            closable={false}
            footer={false}
            onCancel={() => { setModal(false) }}
            title="Booked time slots"
          >
            <div className="p-2">
              {car.bookedTimeSlots.map((slot) => {
                return (
                  <button className="btn1 mt-2 ml-2">
                    {slot.from} - {slot.to}
                  </button>
                );
              })}

              <div className="text-right mt-5">
                <button
                  className="btn1"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </Modal>
        )}

      </Row>
      <Row>
        
      </Row>
      <Footer />
    </DefaultLayout>
  );
}

export default BookingCar;
