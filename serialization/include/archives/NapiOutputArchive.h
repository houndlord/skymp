#pragma once

#include <concepts>
#include <cstdint>
#include <exception>
#include <fmt/format.h>
#include <limits>
#include <napi.h>
#include <optional>
#include <simdjson.h>
#include <stdexcept>
#include <string_view>
#include <type_traits>

#include "concepts/Concepts.h"

class NapiOutputArchive
{
public:
  explicit NapiOutputArchive(Napi::Env env_)
    : env(env_), output_other(), output_object()
    {
			std::cerr << "debug " << __LINE__ << "\n";

    }

  template <IntegralConstant T>
  NapiOutputArchive& Serialize(const char* key, T& input)
  {
    // Compile time constant. Do nothing
    // Maybe worth adding equality check
    return *this;
  }

   template <StringLike T>
   NapiOutputArchive& Serialize(const T& input)
   {
     static_assert(!sizeof(T), "can only parse to std::string");
   }

  NapiOutputArchive& Serialize(const std::string& input)
  {
    OutputAsOther() = Napi::String::New(env, input);
    return *this;
  }

  template <typename T, std::size_t N>
  NapiOutputArchive& Serialize(const std::array<T, N>& input)
  {
    return *this;
  }

  template <ContainerLike T>
  NapiOutputArchive& Serialize(const T& input)
  {
    input.clear();

    return *this;
  }

  template <Arithmetic T>
  NapiOutputArchive& Serialize(const T& input)
  {
    return *this;
  }

  // This function is called when for non-trivial types.
  // It's expected that a special function will handle this, implemented by the
  // said type
  template <NoneOfTheAbove T>
  NapiOutputArchive& Serialize(const T& input)
  {
    return *this;
  }

  template <class T>
  NapiOutputArchive& Serialize(const char* key, const std::optional<T>& input)
  {
    return *this;
  }

  template <class T>
  NapiOutputArchive& Serialize(const char* key, const T& input)
  {
		std::cerr << "debug " << __LINE__ << "\n";

    Napi::Value outputItem;
		std::cerr << "debug " << __LINE__ << "\n";

    NapiOutputArchive ar(env);
		std::cerr << "debug " << __LINE__ << "\n";

    ar.Serialize(outputItem);
		std::cerr << "debug " << __LINE__ << "\n";
		OutputAsObject().Set(key, std::move(outputItem));
		std::cerr << "debug " << __LINE__ << "\n";

    return *this;
  }

  Napi::Value extract_output() {
		std::cerr << "debug " << __LINE__ << "\n";

		if (output_other) {
			return std::move(*output_other);
		}
		std::cerr << "debug " << __LINE__ << "\n";

		if (output_object) {
    	return std::move(*output_object);
		}
		std::cerr << "debug " << __LINE__ << "\n";

		throw std::runtime_error("Unitialised field!");
  }

private:
	Napi::Object& OutputAsObject() {
		std::cerr << "debug " << __LINE__ << "\n";

		if (output_other) {
			throw std::runtime_error("Not object!");
		}
		std::cerr << "debug " << __LINE__ << "\n";

		if (!output_object) {
			output_object = Napi::Object::New(env);
		}
		std::cerr << "debug " << __LINE__ << "\n";

		return *output_object;
	}

	Napi::Value& OutputAsOther() {
		std::cerr << "debug " << __LINE__ << "\n";
		if (output_object) {
			throw std::runtime_error("Not other!");
		}
		if (!output_other) {
			output_other.emplace();
		}		
		return *output_other;
	}

  Napi::Env env;
  std::optional<Napi::Value> output_other;
	std::optional<Napi::Object> output_object;
};
