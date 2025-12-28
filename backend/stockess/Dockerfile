FROM gradle:8-jdk21 AS builder
WORKDIR /home/gradle/project

COPY --chown=gradle:gradle . .

RUN apt-get update && apt-get install -y dos2unix && dos2unix gradlew

RUN ./gradlew clean build -x test

FROM amazoncorretto:21

WORKDIR /app

COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
