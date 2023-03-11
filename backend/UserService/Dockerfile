# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install the dependencies
RUN npm install

# Make port 6000 available to the world outside this container
EXPOSE 6000

# Run the app when the container launches
CMD ["npx", "nodemon"]
