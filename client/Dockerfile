# Use Nginx as the base image
FROM nginx:alpine-slim

# Set the working directory for Nginx
WORKDIR /usr/share/nginx/html

# Copy the pre-built application files from the host into the container
COPY dist/ .

# Optionally copy a custom Nginx configuration file if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
