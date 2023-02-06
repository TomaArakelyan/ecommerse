import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";
import {Badge, Button, Col, ListGroup, ListGroupItem, Row }from "react-bootstrap"

//TODO: Implement this function
async function  HandleClick(productId){
    console.log("bought")
    const payload = productId;
    await axios.post('/api/orders', payload);
}

function Product(){

    const params = useParams();
    const {id} = params;
    const [product, setProduct] = useState([])

    useEffect(()=> {
        const fetchData = async () => {
            const result = await axios.get(`/api/products/${id}`)
            setProduct(result.data)
        };
        fetchData();
    }, [id] );

    return (
        <div>
            <Row>
                <Col md = {6}>
                <img
                className="product-image"
                src = {product.image}
                alt = "product">
                </img>
                </Col>
                <Col md ={3}>
                    <ListGroup variant = "flush">
                        <ListGroup.Item>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description: 
                            <p>{product.description}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price: ${product.price}
                        </ListGroup.Item>
                        <ListGroupItem>
                            <Row>
                                <Col> Status: 
                                </Col>
                                <Col>
                                {product.countInStock >0 ? (
                                    <Badge bg = "success"> In Stock
                                        <ListGroup.Item>
                                          Count in Stock: {product.countInStock}
                                        </ListGroup.Item>
                                    </Badge>
                                    
                                ) : (
                                    <Badge bg = "warning"> Unavailable </Badge>
                                )
                                }
                                </Col>
                            </Row>
                        </ListGroupItem>

                        {product.countInStock > 0 && (
                            <ListGroupItem>
                                <div className="d-grid">
                                    <Button variant = "primary" onClick={() => HandleClick(product.id)}>
                                        Buy
                                    </Button>

                                </div>
                            </ListGroupItem>
                        )}

                    </ListGroup>
                </Col>
                <Col md ={3}></Col>
            </Row>

        </div>
    )
}

export default Product;