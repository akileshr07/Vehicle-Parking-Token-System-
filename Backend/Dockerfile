# Use OpenJDK as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR into the image
COPY build/libs/vptsv1-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the app with ENV-based DB config
ENTRYPOINT ["java", "-jar", "app.jar"]
