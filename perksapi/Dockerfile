# Use a reliable JDK base image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and Maven configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies to cache them
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port your Spring Boot app will run on
EXPOSE 8080

# Default command to run the Spring Boot jar
CMD ["java", "-jar", "target/perksapi-0.0.1-SNAPSHOT.jar"]
