// Product.js
import React, { useState, useEffect } from "react"
import { Button, Card, CardContent, CardMedia, Typography, Box, Grid, Stack, Container } from "@mui/material"
import itemCRUD from "../apis/itemCRUD"
import { useDispatch } from "react-redux"
import { deleteProductAsync } from "../store/slice/productSlice"
import Update from "./Update"

function Product({ product, category }) {
  const { name, price, description, id } = product
  const dispatch = useDispatch()

  const [imageURL, setImageURL] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await itemCRUD.get(`/public/products/img/${id}`)
        const imageData = response.data.data
        if (imageData.encodedImg && imageData.imgType) {
          const dataURL = `data:image/${imageData.imgType};base64,${imageData.encodedImg}`
          setImageURL(dataURL)
        }
      } catch (error) {
        console.error("Error fetching image data:", error)
      }
    }
    fetchImageData()
  }, [id])

  const handleDelete = () => {
    const isConfirmed = window.confirm(`정말로 "${name}" 상품을 삭제하시겠습니까?`)
    if (isConfirmed) dispatch(deleteProductAsync(id))
  }

  const handleUpdateClick = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  return (
    <Container sx={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <Grid container spacing={2} alignItems="center">
        <Box sx={{ width: "150px", height: "150px" }}>
          {imageURL && <CardMedia sx={{ height: "100%", width: "100%", objectFit: "cover" }} image={imageURL} />}
        </Box>
        <Grid item xs={12} md={6}>
          <Card sx={{ margin: "20px" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                메뉴명: {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                설명: {description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                가격: {price}
              </Typography>
            </CardContent>
            <Button onClick={handleDelete}>삭제</Button>
            <Button onClick={handleUpdateClick}>수정</Button>
          </Card>
        </Grid>

        {/* Render the Update modal */}
        <Update
          categoryId={category}
          open={modalOpen}
          handleModal={handleModalClose}
          formData={{ id, name, description, price }}
        />
      </Grid>
    </Container>
  )
}

export default Product
