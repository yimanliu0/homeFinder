import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";

const Wishlist = ({ user, setCurrentModule }) => {
  // since each time we update the schedule, we have to load user again
  const [currUser, setCurrUser] = useState(user);

  useEffect(() => {
    console.log("loading curr");
    getCurrentUser();
    return () => {
      setCurrUser();
    };
  }, []);

  const getCurrentUser = () => {
    const url = "./user/" + user.username;
    axios
      .get(url)
      .then((res) => {
        console.log("success");
        setCurrUser(res.data);
      })
      .catch((err) => {
        console.log("error");
      });
  };

  // Handle cloud database delay issue
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const removeApartment = (aptId) => {
    const url = `./apt/${currUser.username}/${aptId}`;
    axios
      .delete(url)
      .then(async () => {
        const msg = `${currUser.username} remove apartment ${aptId} success!`;
        console.log(msg);
        await sleep(1000);
        getCurrentUser();
      })
      .catch(() => {
        const msg = `${currUser.username} remove apartment ${aptId} fail!`;
        console.log(msg);
      });
  };

  return (
    <div className={"personal-schedule-container"}>
      <ul style={{ listStyle: "none" }}>
        {currUser == null || currUser.wishlist.length === 0 ? (
          <li className="emptylist">
            <Card style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>Your wishlist is empty</Card.Title>
              </Card.Body>
            </Card>
          </li>
        ) : (
          currUser.wishlist.map((apartment) => {
            return (
              <li
                key={`apt-${apartment._id}-${new Date().getSeconds()}`}
                className={"wishlist-container"}
              >
                {/* <div className={'schedule-text'}>
                  <h1>
                    Apartment: <img src={apartment.images[0]} alt="apt" />
                  </h1>
                  <h2 style={{ marginLeft: '10px' }}>
                    Title: {apartment.titletextonly}
                  </h2>
                </div>
                <button onClick={() => removeApartment(apartment._id)}>
                  Remove
                </button> */}
                <Card style={{ width: "65rem" }}>
                  <Card.Header as="h1">
                    <img src={apartment.images[0]} alt="apt" />
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{apartment.titletextonly}</Card.Title>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      <i
                        className="fas fa-map-marker-alt"
                        style={{ color: "#D70F4E", fontSize: "1.0em" }}
                      ></i>{" "}
                      {apartment.mapaddress}
                    </ListGroupItem>
                    <ListGroupItem>Price: {apartment.price}</ListGroupItem>
                    <ListGroupItem>Houseing: {apartment.housing}</ListGroupItem>
                  </ListGroup>
                  <Card.Body>
                    <Button
                      onClick={() => removeApartment(apartment._id)}
                      style={{
                        border: "none",
                        backgroundColor: "Transparent",
                        color: "#D70F4E",
                      }}
                    >
                      <i
                        className="far fa-trash-alt"
                        style={{ color: "#D70F4E", fontSize: "1.5em" }}
                      ></i>
                      Remove from wishlist
                    </Button>
                  </Card.Body>
                </Card>
                <br></br>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default Wishlist;
