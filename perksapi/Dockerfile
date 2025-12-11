# Use an official OpenJDK 17 image
FROM eclipse-temurin:17-jdk

# Set working directory inside container
WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Download dependencies to cache them
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the Spring Boot jar, skip tests for faster builds
RUN ./mvnw clean package -DskipTests

# Copy the built jar to a fixed name
RUN cp target/*.jar app.jar

# Expose the port your Spring Boot app uses
EXPOSE 8081

# Run the jar
CMD ["java", "-jar", "app.jar"]
