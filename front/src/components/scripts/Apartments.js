import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../styles/Apartments.css";

function Apartments({ user }) {
  const [page, setPage] = useState(1);
  const [apartments, setApartments] = useState([]);
  const [currUser, setCurrUser] = useState(user);
  const [filter, setFilter] = useState(0);
  const [sort, setSort] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(1);

  const initialize = async () => {
    try {
      const url = "./apartments/0/0";
      console.log("pass filter " + filter);
      console.log("pass sort " + sort);
      const apt = await fetch(url).then((res) => res.json());
      console.log("load apartment success");
      setApartments(apt);
    } catch (err) {
      console.log("error here");
    }
  };

  // Load apartments (re-render to get the updated apt info)
  const getApt = async () => {
    try {
      const url = "./apartments/" + sort + "/" + filter;
      console.log("pass filter " + filter);
      console.log("pass sort " + sort);
      const apt = await fetch(url).then((res) => res.json());
      console.log("load apartment success");
      setApartments(apt);
    } catch (err) {
      console.log("error");
    }
  };

  const getAptSort = async (sortId) => {
    try {
      const url = "./apartments/" + sortId + "/" + filter;
      console.log("pass filter " + filter);
      console.log("pass sort " + sortId);
      const apt = await fetch(url).then((res) => res.json());
      setApartments(apt);
    } catch (err) {
      console.log("error");
    }
  };

  const getAptFilter = async (filterId) => {
    try {
      const url = "./apartments/" + sort + "/" + filterId;
      console.log("pass filter " + filterId);
      console.log("pass sort " + sort);
      const apt = await fetch(url).then((res) => res.json());
      setApartments(apt);
    } catch (err) {
      console.log("error");
    }
  };

  // Load users (re-render to get the updated user info)
  const loadUser = () => {
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

  // Initialization
  useEffect(() => {
    initialize();
    loadUser();
    setFilter(0);
    setSort(0);
  }, []);

  // Handle cloud database delay issue
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Add apartment to user's wishlist
  const addToWishlist = (aptId) => {
    const url = "/apt";
    const data = {
      username: currUser.username,
      id: aptId,
    };
    axios
      .post(url, data)
      .then(async () => {
        console.log("return back");
        const msg = `${currUser.username} add apartment ${aptId} success!`;
        console.log(msg);
        await sleep(1000);
        loadUser();
        getApt();
      })
      .catch((err) => {
        console.log(err);
        const msg = `${currUser.username} add apartment ${aptId} fail!`;
        console.log(msg);
      });
  };

  // Remove apartment from user's wishlist
  const removeFromWishlist = (aptId) => {
    const url = `./apt/${currUser.username}/${aptId}`;
    axios
      .delete(url)
      .then(async () => {
        const msg = `${currUser.username} remove apartment ${aptId} success!`;
        console.log(msg);
        await sleep(2000);
        loadUser();
      })
      .catch(() => {
        const msg = `${currUser.username} remove apartment ${aptId} fail!`;
        console.log(msg);
      });
  };

  // Add one like
  const updateLike = (aptId, count) => {
    const url = "/addlike";
    const data = {
      username: currUser.username,
      id: aptId,
      count: count,
    };
    console.log(count);
    axios
      .post(url, data)
      .then(() => {
        const msg = `add like for ${aptId} success!`;
        getApt();
        loadUser();
        console.log(msg);
      })
      .catch((err) => {
        console.log(err);
        const msg = `add like for ${aptId} fail!`;
        console.log(msg);
      });
  };

  // Add one dislike
  const updateDislike = (aptId, count) => {
    const url = "/adddislike";
    const data = {
      username: currUser.username,
      id: aptId,
      count: count,
    };
    console.log(count);
    axios
      .post(url, data)
      .then(() => {
        const msg = `add dislike for ${aptId} success!`;
        getApt();
        loadUser();
        console.log(msg);
      })
      .catch((err) => {
        console.log(err);
        const msg = `add dislike for ${aptId} fail!`;
        console.log(msg);
      });
  };

  // Change filter
  const filterApt = (filter) => {
    console.log("change fileter to " + filter);
    setFilter(filter);
    getAptFilter(filter);
  };

  // Change sort condition
  const sortApt = (sort) => {
    console.log("change sort to " + sort);
    setSort(sort);
    getAptSort(sort);
  };

  // Keyword filter
  const searchKeyword = async () => {
    try {
      const keyword = document.getElementById("keyword").value;
      if (keyword === "") {
        setFilter(0);
        setSort(0);
        initialize();
        return null;
      }
      const url = "./search/" + keyword;
      console.log("search for " + keyword);
      const apt = await fetch(url).then((res) => res.json());
      console.log("search success");
      setApartments(apt);
    } catch (err) {
      console.log("error");
    }
  };

  // Handle Pagination
  const changePage = (pageNum) => {
    setPage(pageNum);
    setActive(pageNum);
  };

  const renderApartments = () => {
    if (page <= 0) {
      setPage(1);
    }
    return apartments.slice(1 * page, 1 * page + 5).map((a) => (
      <li className="apartment-list" key={a._id}>
        <Card className="text-center">
          <Card.Header>
            <img src={a.images[0]} alt="apt" />
          </Card.Header>
          <Card.Body>
            <Card.Title>{a.titletextonly}</Card.Title>
            <Card.Text>
              <i
                className="fas fa-map-marker-alt"
                style={{ color: "#D70F4E", fontSize: "1.0em" }}
              ></i>{" "}
              {a.mapaddress}
            </Card.Text>
            <Card.Text>
              {a.price} {a.housing}
            </Card.Text>
            {!currUser.wishlistApt.includes(a._id) ? (
              <div>
                <Button
                  onClick={() => addToWishlist(a._id)}
                  id={`wish-${a._id}`}
                  aria-label="addApt"
                  style={{
                    border: "none",
                    backgroundColor: "Transparent",
                    color: "#D70F4E",
                  }}
                >
                  Add to Wishlist
                </Button>
                <i
                  className="fas fa-cart-plus"
                  style={{ color: "#D70F4E", fontSize: "1.5em" }}
                ></i>
              </div>
            ) : (
              <Button
                onClick={() => removeFromWishlist(a._id)}
                aria-label="removeApt"
                style={{
                  border: "none",
                  backgroundColor: "Transparent",
                  color: "#D70F4E",
                }}
              >
                Remove from Wishlist
              </Button>
            )}
          </Card.Body>
          <Card.Footer className="text-muted" style={{ color: "black" }}>
            {" "}
            <Button
              onClick={() => updateLike(a._id, a.like + 1)}
              aria-label="addLike"
              disabled={currUser.likelist.includes(a._id)}
              style={{ border: "none", backgroundColor: "Transparent" }}
            >
              <i
                className="fas fa-thumbs-up"
                style={{ color: "#D70F4E", fontSize: "1.5em" }}
              ></i>
            </Button>
            {a.like}
            <Button
              onClick={() => updateDislike(a._id, a.dislike + 1)}
              aria-label="addDislike"
              disabled={currUser.dislikelist.includes(a._id)}
              style={{ border: "none", backgroundColor: "Transparent" }}
            >
              <i
                className="fas fa-thumbs-down"
                style={{ color: "#D70F4E", fontSize: "1.5em" }}
              ></i>
            </Button>
            {a.dislike}
          </Card.Footer>
        </Card>
        <br />
      </li>
    ));
  };
  return (
    <div className="apt-container">
      <div className="nav-container">
        <div className="float-container">
          <div className="filter-button">
            <Button
              onClick={() => setOpen(!open)}
              aria-label="filter"
              aria-controls="example-collapse-text"
              aria-expanded={open}
              id="filter-basic-button"
              style={{ color: "D70F4E" }}
            >
              <i
                className="fas fa-filter"
                style={{ color: "D70F4E", fontSize: "0.9em" }}
              ></i>
              Filter
            </Button>
            <Collapse in={open}>
              <div id="example-collapse-text">
                <div>
                  <label>
                    All <input type="checkbox" onClick={() => filterApt(0)} />
                  </label>
                </div>
                <div>
                  <label>
                    Price: Below $2000{" "}
                    <input type="checkbox" onClick={() => filterApt(1)} />
                  </label>
                </div>
                <div>
                  <label>
                    Price: $2000 - $4000{" "}
                    <input type="checkbox" onClick={() => filterApt(2)} />
                  </label>
                </div>
                <div>
                  <label>
                    Price: $4000 - $6000{" "}
                    <input type="checkbox" onClick={() => filterApt(3)} />
                  </label>
                </div>
                <div>
                  <label>
                    Price: Above $6000{" "}
                    <input type="checkbox" onClick={() => filterApt(4)} />
                  </label>
                </div>
              </div>
            </Collapse>
          </div>
          <div className="sort-button">
            <DropdownButton
              id="dropdown-basic-button"
              title="Sort by"
              aria-label="sort"
            >
              <Dropdown.Item href="#" onClick={() => sortApt(1)}>
                Price: Low to High
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => sortApt(2)}>
                Price: High to Low
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => sortApt(3)}>
                Review: High Like
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => sortApt(4)}>
                Review: Low Dislike
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
        <br />
        <br></br>
        <div className="search-label">
          <input
            type="text"
            name="keyword"
            id="keyword"
            placeholder="What would your next home be?"
          ></input>
          <Button
            variant="outline-success"
            onClick={() => searchKeyword()}
            aria-label="search"
          >
            <i
              className="fas fa-search"
              style={{ color: "#D70F4E", fontSize: "2.0em" }}
            ></i>
          </Button>
        </div>
      </div>
      <br></br>
      <ul className="apartment-container" style={{ listStyle: "none" }}>
        {renderApartments()}
      </ul>
      <Pagination
        className="pagination"
        style={{
          fontSize: "24px",
        }}
      >
        <Pagination.First onClick={() => changePage(1)} />
        <Pagination.Prev onClick={() => changePage(page - 1)} />
        <Pagination.Item onClick={() => changePage(1)} active={1 === active}>
          {1}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(6)} active={6 === active}>
          {2}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(11)} active={11 === active}>
          {3}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(16)} active={16 === active}>
          {4}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(21)} active={21 === active}>
          {5}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(26)} active={26 === active}>
          {6}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(31)} active={31 === active}>
          {7}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(36)} active={36 === active}>
          {8}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(41)} active={41 === active}>
          {9}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(46)} active={46 === active}>
          {10}
        </Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Item onClick={() => changePage(71)} active={71 === active}>
          {15}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(76)} active={76 === active}>
          {16}
        </Pagination.Item>
        <Pagination.Item onClick={() => changePage(81)} active={81 === active}>
          {17}
        </Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Next onClick={() => changePage(page + 5)} />
        <Pagination.Last onClick={() => changePage(600)} />
      </Pagination>
    </div>
  );
}

export default Apartments;
